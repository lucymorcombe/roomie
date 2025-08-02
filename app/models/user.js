const db = require('../services/db');
const bcrypt = require("bcryptjs");

class User {
    id;
    email;

    constructor(email) {
        this.email = email;
    }

    async getIdFromEmail(password) {
        try {
            console.log("Running getIdFromEmail for:", this.email);
            var sql = "SELECT users_id FROM Users WHERE Users.email = ?";
            const result = await db.query(sql, [this.email]);
            console.log("DB result:", result);

            if (result.length > 0) {
                this.id = result[0].users_id;
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
            var sql = "UPDATE Users SET password = ? WHERE Users_id = ?";
            const result = await db.query(sql, [pw, this.id]);
            return true;
        } catch (err) {
            console.error("Error in setUserPassword:", err);
            return false;
        }
    }

    async addUser(username, display_name, password) {
        try {
            const pw = await bcrypt.hash(password, 10);
            var sql = "INSERT INTO Users (username, Display_name, email, password) VALUES (?, ?, ?, ?)";
            const result = await db.query(sql, [username, display_name, this.email, pw]);
            console.log(result.insertId);
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

            var sql = "SELECT password FROM Users WHERE users_id = ?";
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
