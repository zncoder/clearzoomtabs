let zoomTabs = {}               // url => tab id

async function closeZoomTabs() {
  let tabs = await new Promise(r => chrome.tabs.query({}, x => r(x)))
  let toRemove = []
  let newTabs = {}
  for (let t of tabs) {
    let u = t.url
    let tid = zoomTabs[u]
    if (tid) {
      toRemove.push(tid)
    } else if (isZoomTab(u)) {
      newTabs[u] = t.id
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
  zoomTabs = newTabs
}

function isZoomTab(url) {
  let u = new URL(url)
  return u.hostname.endsWith(".zoom.us") && url.endsWith("#success")
}

function init() {
  setInterval(closeZoomTabs, 11*1000)
}

init()
