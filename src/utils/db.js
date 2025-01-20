import pg from "pg";

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
});

(async () => {
    try {
        console.log("Connecting...");
        const result = await pool.query("SELECT NOW()");
        console.log("Database connected successfully at:", result.rows[0].now);
    } catch (error) {
        console.error("Database connection error:", error);
    }
})();

export { pool };
