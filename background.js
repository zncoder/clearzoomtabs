let last = new Set()

async function closeZoomTabs() {
  let tabs = await new Promise(r => chrome.tabs.query({}, x => r(x)))
  let next = new Set()
  for (let t of tabs) {
    if (!last.has(t.id) && isZoomTab(t.url)) {
      next.add(t.id)
    }
  }

  if (last.size > 0) {
    let toRemove = [...last]
    chrome.tabs.remove(toRemove, () => {
      if (chrome.runtime.lastError) {
        console.log(`remove tabs err:${chrome.runtime.lastError.message}`)
      }
      console.log(`removed ${toRemove.length} tabs`)
    })
  }
  last = next
}

function isZoomTab(url) {
  let u = new URL(url)
  return u.hostname.endsWith(".zoom.us")
}

function init() {
  setInterval(closeZoomTabs, 11*1000)
}

init()
