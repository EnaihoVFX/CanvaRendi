import { CanvasElement } from "@/types/editor";

export class LayoutEngine {
    private static GRID_SIZE = 10; // Granular grid for general alignment
    private static COLUMN_GRID = 40; // Coarser grid for major sections
    private static CANVAS_WIDTH = 1280;
    private static CENTER_THRESHOLD = 40; // Snap to center if within this range

    /**
     * Process a list of elements to adhere to layout rules
     */
    static process(elements: CanvasElement[]): CanvasElement[] {
        return elements.map(el => this.snapElement(el));
    }

    /**
     * Snap a single element to the grid and apply alignment rules
     */
    private static snapElement(element: CanvasElement): CanvasElement {
        let { x, y, width, height } = element.bounds;

        // 1. Vertical Rhythm: Snap Y to 10px grid
        y = Math.round(y / 10) * 10;

        // 2. Horizontal Grid: Snap X based on element type/role
        // Major sections or large containers align to coarser grid (40px)
        // Smaller elements align to finer grid (10px)
        const gridSize = (width > 300) ? this.COLUMN_GRID : this.GRID_SIZE;
        x = Math.round(x / gridSize) * gridSize;

        // 3. Center Snapping
        // If the element is noticeably centered, force it to be perfectly centered
        const elementCenter = x + width / 2;
        const canvasCenter = this.CANVAS_WIDTH / 2;

        if (Math.abs(elementCenter - canvasCenter) < this.CENTER_THRESHOLD) {
            x = canvasCenter - width / 2;
        }

        // 4. Edge Constraints
        // Ensure no negative coordinates
        x = Math.max(0, x);
        y = Math.max(0, y);

        // Right edge snapping: if close to right edge, snap to it (minus margin)
        const rightEdge = this.CANVAS_WIDTH;
        if (Math.abs((x + width) - rightEdge) < this.COLUMN_GRID) {
            x = rightEdge - width;
        }

        return {
            ...element,
            bounds: {
                ...element.bounds,
                x,
                y,
                width,
                height
            }
        };
    }
}
