// ref: https://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles

import { Delta } from "canva-editor/types";


export const isIntersection = (rect1: Delta[], rect2: Delta[]) => {
    const polygons = [rect1, rect2];
    let minA, maxA, projected, i, i1, j, minB, maxB;
    for (i = 0; i < polygons.length; i++) {
        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        const polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            // grab 2 vertices to create an edge
            const i2 = (i1 + 1) % polygon.length;
            const p1 = polygon[i1];
            const p2 = polygon[i2];

            // find the line perpendicular to this edge
            const normal = {
                x: p2.y - p1.y,
                y: p1.x - p2.x,
            };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < rect1.length; j++) {
                projected = normal.x * rect1[j].x + normal.y * rect1[j].y;

                if (!minA || projected < minA) {
                    minA = projected;
                }

                if (!maxA || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < rect2.length; j++) {
                projected = normal.x * rect2[j].x + normal.y * rect2[j].y;

                if (!minB || projected < minB) {
                    minB = projected;
                }

                if (!maxB || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};
