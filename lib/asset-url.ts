const PRODUCT_ASSET_VERSION = "20260801b";

/**
 * Adds a stable release version to product images served by this website.
 * This prevents browsers from keeping an earlier 404 response after a new
 * cover image is deployed at the same path.
 */
export function versionProductAsset(url: string) {
  if (!url || url.includes("?")) return url;

  const isLocalProductImage = url.startsWith("/products/");
  const isProductionProductImage = url.startsWith("https://luclinhvideoai.com/products/");

  return isLocalProductImage || isProductionProductImage
    ? `${url}?v=${PRODUCT_ASSET_VERSION}`
    : url;
}
