`use strict`
const UserModel = require(`../../models/User/user.model`)
const PostModel = require(`../../models/Post/post.model`)
const CommentModel = require(`../../models/Comment/comment.model`)
const CategoryModel = require(`../../models/Category/category.model`)
const { ConflictError, InternalServerError, BadRequestError, NotFoundError, ForbiddenError } = require(`../../response/error.response`)
const bcrypt = require(`bcrypt`)
const crypto = require(`crypto`)
const PublicKeyModel = require(`../../models/User/PublicKeyModel`)
const PrivateKeyModel = require(`../../models/User/PrivateKeyModel`)
const RefreshTokenModel = require(`../../models/User/RefreshTokenModel`)
const jwt = require(`jsonwebtoken`)
const { getDataToForResponseObject } = require(`../../utils/ExtractResultByLodashPackage`)

class UserService {
    static register = async ({ email, password }) => {
        //check if email has already exists 
        //lean() return a more lightweight result
        const isEmailAvailable = await UserModel.findOne({ "email": email }).lean()
        if (isEmailAvailable) {
            throw new ConflictError(`This email has been used, please try again`)
        }
        //hash the password
        const hashPassword = await bcrypt.hash(password, 10)
        //create new account in database
        //create() = new UserModel + save()
        //save() is used when we edit some UserModel and we want to save the changes we have made
        const newAccount = await UserModel.create({
            email, role: 'Editor', password: hashPassword
        })
        return {
            user: getDataToForResponseObject(["email"], newAccount),
        };

    }

    static login = async ({ email, password, deviceId }) => {
        // Delete the refresh token for the specific device
        await RefreshTokenModel.deleteMany({ deviceId });

        // Delete the public key adn private key for the device
        await PublicKeyModel.deleteMany({ deviceId });
        await PrivateKeyModel.deleteMany({ deviceId });

        // Step 1: Find the user account
        const thisAccount = await UserModel.findOne({ email });
        if (!thisAccount) {
            throw new BadRequestError('Invalid credentials');
        }

        // Step 2: Verify the password
        const isPasswordCorrect = await bcrypt.compare(password, thisAccount.password);
        if (!isPasswordCorrect) {
            throw new BadRequestError('Invalid credentials');
        }

        //xoá tất cả dữ liệu trong trường hợp người dùng chưa logout (login rồi lại gửi request login mà không logout)
        // Delete the refresh token for the specific device
        await RefreshTokenModel.deleteMany({ accountID: thisAccount._id, deviceId });
        await PublicKeyModel.deleteMany({ accountID: thisAccount._id, deviceId });
        await PrivateKeyModel.deleteMany({ accountID: thisAccount._id, deviceId });

        //Step 4: Generate publicKey (to verify access Token and refresh Token) and privateKey (to sign access Token and refresh Token)
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
        });

        const publicKeyInStringFormat = publicKey.toString();
        const privateKeyInStringFormat = privateKey.toString();
        //save public key into database
        await PublicKeyModel.create({
            publicKey: publicKeyInStringFormat,
            accountID: thisAccount._id,
            deviceId
        });

        //save private key into database
        await PrivateKeyModel.create({
            privateKey: privateKeyInStringFormat,
            accountID: thisAccount._id,
            deviceId
        });
        // Step 3: Generate tokens
        const accessToken = jwt.sign(
            { accountID: thisAccount._id, email: thisAccount.email, deviceId },
            privateKey,
            { algorithm: 'RS256', expiresIn: '3 days' }
        );

        const refreshToken = jwt.sign(
            { accountID: thisAccount._id, email: thisAccount.email, deviceId },
            privateKey,
            { algorithm: 'RS256', expiresIn: '7 days' }
        );

        // Step 4: Save the refresh token to the database
        await RefreshTokenModel.create({
            refreshToken,
            accountID: thisAccount._id,
            deviceId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        // Step 5: Return the response
        return {
            accountInfo: getDataToForResponseObject(["_id", "firstName", "email", "fullname", "profilePhoto", "isAdmin"], thisAccount),
            accessToken,
            refreshToken
        };
    };

    static logout = async ({ accountID, deviceId }) => {
        console.log(deviceId)
        // Delete the refresh token for the specific device
        await RefreshTokenModel.deleteOne({ accountID, deviceId });

        // Delete the public key adn private key for the device
        await PublicKeyModel.deleteOne({ accountID, deviceId });
        await PrivateKeyModel.deleteOne({ accountID, deviceId });

        return "OK"
    };

    static logoutFromAllDevices = async ({ accountID }) => {
        try {
            await RefreshTokenModel.deleteMany({ accountID });
            await PublicKeyModel.deleteMany({ accountID });
            await PrivateKeyModel.deleteMany({ accountID });

            return 'Logged out from all devices successfully'
        } catch (error) {
            //giả lâhp tình huống gửi báo cáo về cho admin ngay
            console.error('Error during logout:', error);
            throw new InternalServerError('Failed to logout from all devices');
        }
    };


    static refreshAccessToken = async ({ refreshToken, deviceId }) => {
        if (!refreshToken || !deviceId) {
            throw new InternalServerError('Refresh token and device ID are required');
        }

        // Step 1: Find the refresh token in the database
        const storedToken = await RefreshTokenModel.findOne({ refreshToken, deviceId });

        if (!storedToken) {
            throw new InternalServerError('Invalid refresh token or device mismatch');
        }

        // Step 2: Check if the deviceId matches (hacker gửi từ thiết bị khác)
        //rất hiếm nhưng có thể xảy ra, hacker gửi đại tổ hợp refreshToken và device Id 
        //xui rủi sao cặp này đúng
        //mình sẽ check trường hợp tệ nhất, do refreshToken có chứa cả deviceId, nếu deviceId này != deviceId của hacker ==> hacker đang phá
        if (storedToken.deviceId !== deviceId) {
            //có mùi hacker, buộc đăng xuất tất cả thiết bị cho chắc ăn
            await this.logoutFromAllDevices(storedToken.accountID)
        }

        // Step 2: Verify if the token is expired
        if (storedToken.expiresAt < new Date()) {
            await RefreshTokenModel.deleteOne({ token: refreshToken });
            throw new InternalServerError('Refresh token has expired');
        }

        // Step 3: Decode the refresh token to get the account ID 
        // (do chỉ có refresh token nên không biết được id nào để tìm public key, 
        // nên buộc phải decode (giải mã không đảm bảo dữ liệu chưa bị táy máy))
        // jwt.verify (giải mã + đảm bảo dữ liệu an toàn nhưng cần có publicKey)
        const publicKeyEntry = await PublicKeyModel.findOne({ accountID: storedToken.accountID, deviceId });
        if (!publicKeyEntry) {
            throw new InternalServerError("Public key not found for this device");
        }

        const decoded = jwt.verify(refreshToken, publicKeyEntry.publicKey, { algorithms: ["RS256"] });

        const privateKeyEntry = await PrivateKeyModel.findOne({ accountID: decoded.accountID, deviceId });
        if (!privateKeyEntry) {
            throw new InternalServerError("Private key not found for this device");
        }

        const privateKey = privateKeyEntry.privateKey; // Assuming it's stored in plaintext (not recommended in production)

        // Step 5: Generate a new access token
        const newAccessToken = jwt.sign(
            { accountID: decoded.accountID, email: decoded.email, deviceId },
            privateKey,
            { algorithm: 'RS256', expiresIn: '3 days' }
        );


        return { "accessToken": newAccessToken };
    };


    static profileUpdate = async (req) => {
        const user = await UserModel.findById(req.user.accountID);
        if (!user) {
            throw new NotFoundError('User not found')
        }
        const { firstName, lastName } = req.body;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.profilePhoto = req.file ? req.file.path : user.profilePhoto;
        await user.save();
        return {
            user: getDataToForResponseObject(["_id", "firstName", "lastName", "profilePhoto"], user)
        }
    }

    static whoViewMyProfile = async (req) => {
        //tình huống: Lý Hải click vào trang cá nhân của Minh Hà
        //thì endpoint này sẽ thêm Lý Hải vào danh sách những người đã vào xem trang cá nhân của Minh Hà
        //originUser là Mình Hà
        const originUser = await UserModel.findById(req.params.id)
        //theOneThatViewedOriginUser là Lý Hải
        const theOneThatViewedOriginUser = await UserModel.findById(req.user.accountID)
        if (!originUser || !theOneThatViewedOriginUser) {
            throw new BadRequestError()
        }

        // Check if the viewer is blocked by the profile owner
        const isBlocked = originUser.blocked.find(
            blockedUser => blockedUser.toString() === theOneThatViewedOriginUser._id.toString()
        );

        if (isBlocked) {
            return "You cannot view this profile because the user has blocked you.";
        }
        //kiểm tra xem Lý Hải này đã xem trang cá nhân của Minh Hà hay chưa
        const isUserAlreadyViewed = originUser.viewers.find(
            viewer => viewer.toString() === theOneThatViewedOriginUser._id.toString()
        );

        if (!isUserAlreadyViewed) {
            originUser.viewers.push(theOneThatViewedOriginUser._id);
        }


        await originUser.save();
        return getDataToForResponseObject(["_id", "lastName", "firstName", "profilePhoto"], originUser)
    }

    static following = async (req) => {
        // originUser = Minh Hà (the one being followed)
        const originUser = await UserModel.findById(req.params.id);

        // theOneThatFollows = Lý Hải (the one who clicked follow)
        const theOneThatFollows = await UserModel.findById(req.user.accountID);

        if (!originUser || !theOneThatFollows) {
            throw new BadRequestError("User not found");
        }
        // Check if the originUser is in the blocked list of the user they want to follow
        const isBlocked = theOneThatFollows.blocked.find(
            blockedUser => blockedUser.toString() === originUser._id.toString()
        );

        if (isBlocked) {
            return "You cannot follow this user because they have blocked you.";
        }

        // Check if already following
        const isAlreadyFollowing = originUser.follower.find(
            follower => follower.toString() === theOneThatFollows._id.toString()
        );

        if (isAlreadyFollowing) {
            return "You are already following this user";
        }

        // Add Lý Hải to Minh Hà's follower list
        originUser.follower.push(theOneThatFollows._id);

        // Add Minh Hà to Lý Hải's following list
        theOneThatFollows.following.push(originUser._id);

        // Save changes
        await originUser.save();
        await theOneThatFollows.save();

        return "Followed successfully";
    }

    static unfollowing = async (req) => {
        // originUser = Minh Hà (the one being unfollowed)
        const originUser = await UserModel.findById(req.params.id);

        // theOneThatUnfollows = Lý Hải (the one who wants to unfollow)
        const theOneThatUnfollows = await UserModel.findById(req.user.accountID);

        if (!originUser || !theOneThatUnfollows) {
            throw new BadRequestError("User not found");
        }

        // Check if theOneThatUnfollows is actually following originUser
        const isFollowing = theOneThatUnfollows.following.find(
            following => following.toString() === originUser._id.toString()
        );

        if (!isFollowing) {
            return "You are not following this user";
        }

        // Remove Lý Hải from Minh Hà's follower list
        originUser.follower = originUser.follower.filter(
            follower => follower.toString() !== theOneThatUnfollows._id.toString()
        );

        // Remove Minh Hà from Lý Hải's following list
        theOneThatUnfollows.following = theOneThatUnfollows.following.filter(
            following => following.toString() !== originUser._id.toString()
        );

        // Save changes
        await originUser.save();
        await theOneThatUnfollows.save();

        return "Unfollowed successfully";
    }

    static blocking = async (req) => {
        // originUser = Minh Hà (the one blocking another user)
        const originUser = await UserModel.findById(req.user.accountID);

        // theOneToBeBlocked = Lý Hải (the one being blocked)
        const theOneToBeBlocked = await UserModel.findById(req.params.id);

        if (!originUser || !theOneToBeBlocked) {
            throw new BadRequestError("User not found");
        }

        // Check if the user is already blocked
        const isBlocked = originUser.blocked.find(
            blockedUser => blockedUser.toString() === theOneToBeBlocked._id.toString()
        );

        if (isBlocked) {
            return "This user is already blocked";
        }

        // Add user to blocked list
        originUser.blocked.push(theOneToBeBlocked._id);

        // Remove blocked user from followers list
        originUser.follower = originUser.follower.filter(
            follower => follower.toString() !== theOneToBeBlocked._id.toString()
        );

        // Remove blocked user from following list
        originUser.following = originUser.following.filter(
            following => following.toString() !== theOneToBeBlocked._id.toString()
        );

        // Remove originUser from blocked user's following list
        theOneToBeBlocked.following = theOneToBeBlocked.following.filter(
            following => following.toString() !== originUser._id.toString()
        );

        // Remove originUser from blocked user's followers list
        theOneToBeBlocked.follower = theOneToBeBlocked.follower.filter(
            follower => follower.toString() !== originUser._id.toString()
        );

        // Save changes
        await originUser.save();
        await theOneToBeBlocked.save();

        return "User blocked successfully";
    }

    static unblocking = async (req) => {
        // User who is unblocking (e.g., You)
        const originUser = await UserModel.findById(req.user.accountID);
        // User being unblocked (e.g., Mary)
        const userToUnblock = await UserModel.findById(req.params.id);

        if (!originUser || !userToUnblock) {
            throw new BadRequestError("User not found");
        }

        // Check if the user is actually blocked
        const isBlocked = originUser.blocked.find(
            blockedUser => blockedUser.toString() === userToUnblock._id.toString()
        );

        if (!isBlocked) {
            return "User is not blocked.";
        }

        // Remove the user from the blocked list
        originUser.blocked = originUser.blocked.filter(
            blockedUser => blockedUser.toString() !== userToUnblock._id.toString()
        );

        // Save changes
        await originUser.save();

        return "User has been unblocked successfully.";
    }

    static adminBlocking = async (req) => {
        const userId = req.params.id;

        // Prevent admin from blocking themselves
        if (req.user.accountID === userId) {
            throw new BadRequestError("You cannot block yourself.");
        }

        // Find the user
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        // Toggle the `isBlocked` status
        user.isBlocked = true;
        await user.save();
        return `admin has blocked the user : ${userId}`
    }
    static adminUnblocking = async (req) => {
        const userId = req.params.id;

        // Prevent admin from unblocking themselves
        if (req.user.accountID === userId) {
            throw new BadRequestError("You cannot unblock yourself.");
        }

        // Find the user
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        // Set `isBlocked = false` to unblock the user
        if (!user.isBlocked) {
            throw new BadRequestError("User is already unblocked.");
        }
        user.isBlocked = false;
        await user.save();
        return `admin has unblocked the user : ${userId}`
    }

    static updateEmail = async (req) => {
        const { email } = req.body;
        const isEmailTaken = await UserModel.findOne({email});
        if(isEmailTaken){
            throw new ConflictError('Email has been taken')
        }
        const user = await UserModel.findByIdAndUpdate(req.user.accountID, {
            email
        }, {new: true});
        return {
            user: getDataToForResponseObject(["email"], user)
        }
    }

    static updatePassword = async (req) => {
        const { oldPassword, newPassword } = req.body;
        const user = await UserModel.findById(req.user.accountID);
        if(!user){
            throw new NotFoundError('User not found')
        }
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordCorrect){
            throw new BadRequestError('Old password is incorrect')
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.findByIdAndUpdate(req.user.accountID, {
            password: hashPassword
        }, {new: true})
        return { user: getDataToForResponseObject(["email"], user) }
    }

    static deleteAccount = async (req) => {
        const user = await UserModel.findById(req.user.accountID);
        if(!user){
            throw new NotFoundError('User not found')
        }
        //delete all the posts of the user
        await PostModel.deleteMany({author: user._id});
        //delete all the comments of the user
        await CommentModel.deleteMany({author: user._id});
        //delete all the categories of the user
        await CategoryModel.deleteMany({author: user._id});
        //delete the user
        await UserModel.findOneAndDelete({ _id: user._id});
        
        return 
    }

    static userProfile = async (req) => {
        const user = await UserModel.findById(req.params.id);
        if(!user){
            throw new NotFoundError('User not found')
        }
        return getDataToForResponseObject(["_id", "fullname", "profilePhoto", "follower", "following" ,"blocked", "firstName", "lastName", "viewers"], user)
    }

    static getAllUsersForAdmin = async (req) => {
        const users = await UserModel.find({}, '_id email isBlocked isAdmin');
        return users;
    }
    





}

module.exports = UserService