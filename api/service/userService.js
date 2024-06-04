export const createUserService= async(users)=>{
try {
    const result = await poolRequest()
        .input('username', sql.VarChar, users.username)
        .input('email', sql.VarChar, users.email)
        .input('Position',sql.VarChar,users.Position)
        .input('password', sql.VarChar, users.password)
        .input('name', sql.VarChar, users.name)
        .query("USE NetworkApp; INSERT INTO users (username, email, paswword, name)  VALUES (@username, @email, @paswword, @name)");
        
    return result;
} catch (error) {
    return error;
}
}