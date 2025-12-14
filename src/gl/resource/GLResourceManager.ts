import { isIdentifiable } from "../../identity/Identifiable";
import type { GLDisposable } from "../GLDisposable";

class GLResourceManager {
  private static resourceMap: Map<WebGL2RenderingContext, GLDisposable[]>;

  static {
    GLResourceManager.resourceMap = new Map();
  }

  static add(gl: WebGL2RenderingContext, resource: GLDisposable): void {
    const {resourceMap} = GLResourceManager;
    const resources = resourceMap.get(gl) ?? [];
    resources.push(resource);
    resourceMap.set(gl, resources);
  }

  static getTagList(gl: WebGL2RenderingContext): string[] | null {
    const {resourceMap} = GLResourceManager;
    const resources = resourceMap.get(gl);
    if (!resources) {
      return null;
    }

    const tagList: string[] = [];
    for (const resource of resources) {
      if (!isIdentifiable(resource)) {
        continue;
      }
      tagList.push(resource.tag);
    }
    return tagList;
  }

  static disposeAll(gl: WebGL2RenderingContext): void {
    const {resourceMap} = GLResourceManager;
    const resources = resourceMap.get(gl);
    if (!resources) {
      return;
    }

    for (const resource of resources) {
      resource.dispose(gl);
    }
    resources.length = 0;
    resourceMap.delete(gl);
  }
}

export {GLResourceManager};
