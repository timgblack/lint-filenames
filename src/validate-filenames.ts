import fs from 'fs';

export async function validateFilenames(
  path: string,
  pattern: RegExp
): Promise<{
  totalFilesAnalyzed: number;
  failedFiles: string[];
}> {
  console.log(`ℹ️  Path:    \t\t'${path}'`);
  console.log(`ℹ️  Pattern: \t\t${pattern}`);
  const opendir = fs.promises.opendir;
  const failedFiles = [];
  let totalFilesAnalyzed = 0;

  try {
    try {
      const dotdir = await opendir('./clients');
      const entries = [];
      for await (const dirent of dotdir) entries.push(dirent);
      console.log(entries);
    } catch {
      // Left empty
    }
    const dir = await opendir(path);

    console.log('Verification starting...');
    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        continue;
      }
      totalFilesAnalyzed++;
      if (pattern.test(dirent.name)) {
        console.log(`  ✔️  ${dirent.name}`);
      } else {
        console.log(`  ❌  ${dirent.name}`);
        failedFiles.push(dirent.name);
      }
    }
    console.log('Verification finished.');
    console.log(`ℹ️  Files analyzed: \t${totalFilesAnalyzed}`);
  } catch (error) {
    console.error(error);
    throw new Error('Execution failed, see log above. ❌');
  }

  if (failedFiles.length) {
    throw new Error(
      `${failedFiles.length} files not matching the pattern were found, see log above. ❌`
    );
  } else {
    console.log('✅ Success: All files match the given pattern!');
    return {
      totalFilesAnalyzed,
      failedFiles,
    };
  }
}
