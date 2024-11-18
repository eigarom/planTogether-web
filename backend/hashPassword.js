const bcrypt = require("bcryptjs");

async function hashPassword() {
    const password = "Motdepasse12345*";
    const saltRounds = 10;

    try {
       const hashedPassword = await bcrypt.hash(password, saltRounds);
       console.log(hashedPassword);
    } catch (err) {
       console.error("Erreur lors du hachage du mot de passe :", err);
    }
}

hashPassword();