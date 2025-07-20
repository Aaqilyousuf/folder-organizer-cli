import fs from "fs";
import path from "path";
import chalk from "chalk";
import minimist from "minimist";
// Optional emoji support
const useEmoji = process.stdout.isTTY && !process.env.NO_COLOR;

function log(message: string, emoji?: string) {
  const symbol = useEmoji && emoji ? `${emoji} ` : "";
  console.log(`${symbol}${message}`);
}

const fileTypeMap: Record<string, string> = {
  jpg: "images",
  png: "images",
  gif: "images",
  mp4: "videos",
  mp3: "audios",
  txt: "documents",
  pdf: "documents",
  docx: "documents",
  xlsx: "documents",
  pptx: "documents",
  zip: "archives",
  rar: "archives",
};

type Options = {
  verbose?: boolean;
  dryRun?: boolean;
};

export function organizeFolder(folderPath: string, options: Options = {}) {
  const { verbose = false, dryRun = false } = options;

  if (!fs.existsSync(folderPath)) {
    log(chalk.red("Folder not found."), "❌");
    return;
  }

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) continue;

    const ext = path.extname(file).slice(1).toLowerCase();
    const targetFolder = fileTypeMap[ext] || "others";
    const targetPath = path.join(folderPath, targetFolder);
    const destination = path.join(targetPath, file);

    if (verbose) {
      log(
        chalk.gray(`Found file: ${file} (ext: .${ext}) → ${targetFolder}/`),
        "🔍"
      );
    }

    if (!fs.existsSync(targetPath)) {
      if (!dryRun) {
        fs.mkdirSync(targetPath);
      }
      if (verbose) {
        log(chalk.cyan(`Creating folder: ${targetFolder}/`), "📁");
      }
    }

    if (!dryRun) {
      fs.renameSync(fullPath, destination);
    }

    log(
      chalk.green(
        `${dryRun ? "[Dry Run] " : ""}Moved ${file} → ${targetFolder}/`
      ),
      dryRun ? "🧪" : "✅"
    );
  }

  log(
    chalk.blue(
      dryRun
        ? "Dry run completed. No files were moved."
        : "🎉 Folder organized successfully!"
    ),
    "📦"
  );
}

const args = minimist(process.argv.slice(2));
const folderPath = args._[0];
const verbose = args.verbose || false;
const dryRun = args["dry-run"] || false;

if (!folderPath) {
  console.log(chalk.yellow("⚠️ Please provide a folder path."));
} else {
  organizeFolder(path.resolve(folderPath), { verbose, dryRun });
}
