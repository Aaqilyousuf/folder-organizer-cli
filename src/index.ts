import { Command } from "commander";
import { organizeFolder } from "./organizer";

const program = new Command();

program
  .name("folder-organizer")
  .description("Organizes files in a folder by type")
  .version("1.0.0")
  .argument("<folderPath>", "Path to the folder you want to organize")
  .option("--verbose", "Enable detailed logs")
  .option("--dry-run", "Preview actions without moving files")
  .action((folderPath, options) => {
    organizeFolder(folderPath, {
      verbose: options.verbose || false,
      dryRun: options.dryRun || false,
    });
  });

program.parse();
