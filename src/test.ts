function getAll(dir: string): string[] {
  const paths: string[] = [];
  for (const entry of Deno.readDirSync(dir)) {
    if (entry.isFile) {
      paths.push(entry.name);
    } else if (entry.isDirectory) {
      for (const subEntry of getAll(`${dir}/${entry.name}`)) {
        paths.push(`${entry.name}/${subEntry}`);
      }
    }
  }

  return paths;
}

console.log(getAll("./routes"));
