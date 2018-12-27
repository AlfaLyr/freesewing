import { draftBarrelCuff, decorateBarrelCuff } from "./shared";

export default part => {
  // prettier-ignore
  let {store, measurements, utils, sa, Point, points, Path, paths, Snippet, snippets, complete, paperless, macro, options} = part.shorthand();

  draftBarrelCuff(part);
  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomRight)
    .line(points.topRight)
    .line(points.topLeft)
    .close()
    .attr("class", "fabric");

  // Complete pattern?
  if (complete) {
    decorateBarrelCuff(part);
    if (sa) paths.sa = paths.seam.offset(sa);
  }

  // Paperless?
  if (paperless) {
  }

  return part;
};