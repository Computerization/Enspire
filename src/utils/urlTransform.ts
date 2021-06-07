function encode(name: string): string {
  return name.replaceAll(/\s/g, "-").toLowerCase();
}

export { encode };
