const db = require('../services/db');
const bcrypt = require("bcryptjs");

class User {
    id;
    email;

    constructor(email) {
        this.email = email;
    }

    async getIdFromEmail() {
        try {
            console.log("Running getIdFromEmail for:", this.email);

            if (!this.email) {
                throw new Error("Email is undefined in getIdFromEmail");
            }

            var sql = "SELECT user_id FROM users WHERE email = ?";
            const result = await db.query(sql, [this.email]);
            console.log("DB result:", result);

            if (result.length > 0) {
                this.id = result[0].user_id;
                return this.id;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Error in getIdFromEmail:", err);
            return false;
        }
    }


    async setUserPassword(password) {
        try {
            const pw = await bcrypt.hash(password, 10);
            var sql = "UPDATE users SET password_hash = ? WHERE user_id = ?";
            const result = await db.query(sql, [pw, this.id]);
            return true;
        } catch (err) {
            console.error("Error in setUserPassword:", err);
            return false;
        }
    }

    async addUser(first_name, last_name, dob, email, password) {
        try {
            const pw = await bcrypt.hash(password, 10);
            var sql = "INSERT INTO users (first_name, last_name, dob, email, password_hash) VALUES (?, ?, ?, ?, ?)";
            const result = await db.query(sql, [first_name, last_name, dob, email, pw]);
            console.log("db.query result in addUser:", result);
            this.id = result.insertId; 
            return this.id;
        } catch (err) {
            console.error("Error in addUser:", err);
            return false;
        }
    }

    async authenticate(submitted) {
        try {
            if (!this.id) {
                this.id = await this.getIdFromEmail();
                if (!this.id) {
                    return false;
                }
            }

            console.log("Authenticating user ID:", this.id);

            var sql = "SELECT password FROM users WHERE user_id = ?";
            const result = await db.query(sql, [this.id]);

            if (result.length === 0) {
                return false;
            }

            console.log("Stored hashed password:", result[0].password);

            const match = await bcrypt.compare(submitted, result[0].password);
            console.log("Password match result:", match);

            return match;
        } catch (err) {
            console.error("Error in authenticate:", err);
            return false;
        }
    }
}

module.exports = {
    User
}
