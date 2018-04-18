/**
 * @module Config
 * @description Global configuration constants
 */

import * as myself from "Config";
export default myself;

/** Default thickness of a plot axis. This sets the width for Y-axis and height for X-axis */
export const DEFAULT_AXIS_THICKNESS=45;

/**
 * Number of coordinates per vertex for use when created packed arrays of vertex coordinates.
 * The first three are x,y,z.
 */
export const COORDS_PER_VERT = 3;

/**
 * WebGl lineWidth for drawing major grid and axis lines.
 */
export const MAJOR_GRID_LINE_WIDTH = 2;

/**
 * WebGl lineWidth for drawing minor grid and axis lines.
 */
export const MINOR_GRID_LINE_WIDTH = 1;

/**
 * WebGl clear color: (r,g,b,a)
 */
export const CLEAR_COLOR = [0.00, 0.00, 0.00, 0.00];

/**
 * Color of major grid lines: (r,g,b,a)
 */
export const MAJOR_GRID_COLOR = [0.00, 0.00, 0.00, 0.50];

/**
 * Color of minor grid lines: (r,g,b,a)
 */
export const MINOR_GRID_COLOR = [0.00, 0.00, 0.00, 0.25];
