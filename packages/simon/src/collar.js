export default part => {
  // prettier-ignore
  let {store, measurements, utils, sa, Point, points, Path, paths, Snippet, snippets, complete, paperless, macro, options} = part.shorthand();

  const draft = function(tweak = 1) {
    let length =
      measurements.neckCircumference *
      (1 + options.collarEase - options.collarGap) *
      tweak;
    let width = options.collarStandWidth * (1 + options.collarRoll);

    // Draft right side
    points.topMid = new Point(0, 0);
    points.bottomMid = new Point(0, width);
    points.bottomMidCp1 = points.bottomMid.shift(0, length * 0.35);
    points.rightBottomEdge = new Point(
      length / 2,
      width + length * options.collarBend
    );
    points.rightTopHinge = points.topMid.shift(0, length * 0.25);
    points.rightTopEdgeDirection = points.rightTopHinge.shift(
      options.collarFlare,
      10
    );
    points.rightBottomEdgeDirection = points.rightBottomEdge.shift(
      options.collarAngle,
      10
    );
    points.rightTopEdge = utils.beamsIntersect(
      points.rightTopHinge,
      points.rightTopEdgeDirection,
      points.rightBottomEdge,
      points.rightBottomEdgeDirection
    );
    points.rightTopHingeCp1 = points.rightTopHinge.shift(0, length * 0.1);

    // Draft left side
    points.leftTopHinge = points.rightTopHinge.flipX();
    points.bottomMidCp2 = points.bottomMidCp1.flipX();
    points.leftTopHingeCp2 = points.rightTopHingeCp1.flipX();
    points.leftTopEdge = points.rightTopEdge.flipX();
    points.leftBottomEdge = points.rightBottomEdge.flipX();

    let len = new Path()
      .move(points.leftBottomEdge)
      ._curve(points.bottomMidCp2, points.bottomMid)
      .length();

    return (
      len * 2 -
      measurements.neckCircumference *
        (1 + options.collarEase - options.collarGap)
    );
  };

  let delta, tweak, run;
  tweak = 1;
  run = 1;
  do {
    delta = draft(tweak);
    tweak = tweak * (1 - delta / 1000);
    run++;
    console.log("tweak is", tweak, "run", run, "delta", delta);
  } while (Math.abs(delta) > 1 && run < 20);

  paths.seam = new Path()
    .move(points.bottomMid)
    .curve_(points.bottomMidCp1, points.rightBottomEdge)
    .line(points.rightTopEdge)
    ._curve(points.rightTopHingeCp1, points.rightTopHinge)
    .line(points.topMid)
    .line(points.leftTopHinge)
    .curve_(points.leftTopHingeCp2, points.leftTopEdge)
    .line(points.leftBottomEdge)
    ._curve(points.bottomMidCp2, points.bottomMid)
    .close()
    .attr("class", "fabric");

  // Complete pattern?
  if (complete) {
    // Draw undercollar line
    let uc = points.topMid.dist(points.bottomMid) * 0.05;
    points.ucTopMid = points.topMid.shift(-90, uc);
    points.ucRightTopHinge = points.rightTopHinge.shift(-90, uc);
    points.ucRightTopHingeCp1 = points.rightTopHingeCp1.shift(-90, uc);
    points.ucLeftTopHinge = points.ucRightTopHinge.flipX();
    points.ucLeftTopHingeCp2 = points.ucRightTopHingeCp1.flipX();
    paths.underCollar = new Path()
      .move(points.rightTopEdge)
      ._curve(points.ucRightTopHingeCp1, points.ucRightTopHinge)
      .line(points.ucLeftTopHinge)
      .curve_(points.ucLeftTopHingeCp2, points.leftTopEdge)
      .attr("class", "dotted")
      .attr("data-text", "cutUndercollarSlightlySmaller")
      .attr("data-text-class", "center");

    // Helplines
    paths.help = new Path()
      .move(points.topMid)
      .line(points.bottomMid)
      .attr("class", "dotted");

    // Grainline
    macro("grainline", {
      from: points.bottomMidCp2.shift(90, 10),
      to: points.bottomMidCp1.shift(90, 10)
    });

    // Title
    points.title = new Point(20, points.bottomMid.y / 2);
    macro("title", {
      at: points.title,
      nr: "7 & 8",
      title: "collarAndUndercollar",
      scale: 0.6,
      append: true
    });

    // Indicate collar stand side
    paths.collarStandLeft = new Path()
      .move(points.leftBottomEdge)
      ._curve(points.bottomMidCp2, points.bottomMid)
      .attr("data-text", "sideOfTheCollarStand")
      .attr("data-text-class", "center");
    paths.collarStandRight = new Path()
      .move(points.bottomMid)
      .curve_(points.bottomMidCp1, points.rightBottomEdge)
      .attr("data-text", "sideOfTheCollarStand")
      .attr("data-text-class", "center");
    // Notches
    macro("sprinkle", {
      snippet: "notch",
      on: [
        "bottomMid",
        "rightBottomEdge",
        "leftBottomEdge",
        "rightTopEdge",
        "leftTopEdge"
      ]
    });

    if (sa) {
      paths.sa = paths.seam.offset(sa).attr("class", "fabric sa");
      paths.saUndercollar = paths.underCollar
        .offset(sa)
        .attr("class", "dotted");
    }
  }

  // Paperless?
  if (paperless) {
  }

  return part;
};