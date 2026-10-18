/**
 * Deploy ke GitHub Pages.
 * Windows sering gagal karena path slug produk + folder __next.* melebihi MAX_PATH (~260).
 * Skrip ini: bersihkan cache gh-pages (long-path aware) lalu push dengan core.longpaths.
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const cacheRoot = join(root, "node_modules", ".cache", "gh-pages");

function toLongPath(p) {
  const abs = resolve(p);
  if (process.platform !== "win32") return abs;
  if (abs.startsWith("\\\\?\\")) return abs;
  return `\\\\?\\${abs}`;
}

function rmDeep(dir) {
  if (!existsSync(dir)) return;
  try {
    rmSync(toLongPath(dir), { recursive: true, force: true, maxRetries: 8, retryDelay: 100 });
    console.log(`Cleared cache: ${dir}`);
  } catch (err) {
    console.warn(`Cache cleanup warning: ${err.message}`);
    // Fallback robocopy mirror (Windows) untuk folder bandel
    if (process.platform === "win32") {
      const empty = join(root, ".empty-gh-pages-tmp");
      try {
        execSync(`mkdir "${empty}" 2>nul & robocopy "${empty}" "${dir}" /MIR /NFL /NDL /NJH /NJS /nc /ns /np & rmdir "${empty}" & rmdir "${dir}"`, {
          stdio: "inherit",
          shell: true,
        });
      } catch {
        /* robocopy exit codes 0-7 often mean success */
      }
    }
  }
}

rmDeep(cacheRoot);

const env = {
  ...process.env,
  // Aktif hanya untuk proses git di deploy ini — tidak mengubah git config permanen
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "core.longpaths",
  GIT_CONFIG_VALUE_0: "true",
};

console.log("Publishing ./out → gh-pages …");
execSync("npx gh-pages -d out --nojekyll", {
  cwd: root,
  stdio: "inherit",
  env,
});
console.log("Deploy selesai.");
