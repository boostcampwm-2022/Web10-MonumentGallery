interface IURLCreatorProps {
  path: string;
  params: Record<string, unknown>;
}
export default function URLCreator({ path, params }: IURLCreatorProps) {
  if (!params) {
    return path;
  }
  let url = path + "?";
  Object.keys(params).forEach((key) => {
    url += key + "=" + params[key] + "&";
  });
  return url;
}
