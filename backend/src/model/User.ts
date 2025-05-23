import mongoose, { Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    username: string;
    name: string;
    password: string;
    isAdmin: boolean;
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

export const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: false },
    name: { type: String, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true}
});

const SALT_FACTOR = 10;

UserSchema.pre<IUser>('save', function(next) {
    const user = this;

    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            user.password = hashedPassword;
            next();
        });
    });

});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (!isMatch) {
            callback(new Error('Password does not match'), false);
        }
        else callback(null, isMatch);
    });
}

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

declare global {
    namespace Express {
        export interface User {
            email: string;
            username: string;
            name: string;
            password: string;
            isAdmin: boolean;
        }
    }
}