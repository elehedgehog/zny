export const viewerCor = () => {
  let viewCenter = map.getCenter()
  let lat = viewCenter.lat, lng = viewCenter.lng
  if (17.84 > lat || lat > 26.65 || lng < 109.01 || lng > 117.81) map.setView([23, 113], 5, { animate: true })
}