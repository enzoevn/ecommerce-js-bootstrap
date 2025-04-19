export function zoomImage(image) {
    image.style.transform = 'scale(1.1)';
    image.style.transition = 'transform 0.5s';
    image.style.zIndex = '2';
    image.style.position = 'relative';
}
export function zoomReset(image) {
    image.style.transform = 'scale(1)';
    image.style.zIndex = '1';
}