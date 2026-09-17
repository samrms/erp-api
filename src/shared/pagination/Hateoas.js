export function link(href, method = 'GET') {
  return { href, method }
}

export function selfLink(resourcePath, id) {
  return link(`${resourcePath}/${id}`)
}
