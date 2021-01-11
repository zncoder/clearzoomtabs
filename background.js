async function closeZoomTabs() {
  let tabs = await new Promise(r => chrome.tabs.query({}, x => r(x)))
  let toRemove = []
  for (let t of tabs) {
    if (!t.active && isZoomTab(t.url)) {
      toRemove.push(t.id)
    }
  }

  if (toRemove.length > 0) {
    chrome.tabs.remove(toRemove, () => {
      if (chrome.runtime.lastError) {
        console.log(`remove tabs err:${chrome.runtime.lastError.message}`)
      }
      console.log(`removed ${toRemove.length} tabs`)
    })
  }
}

function isZoomTab(url) {
  let u = new URL(url)
  return u.hostname.endsWith(".zoom.us") && url.endsWith("#success")
}

function init() {
  setInterval(closeZoomTabs, 11*1000)
}

init()
