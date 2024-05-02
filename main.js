function setFieldValues() {
    const urlSearchParams = new URLSearchParams(window.location.search)

    let linkValue = urlSearchParams.get("url")
    linkValue ||= localStorage.getItem("link")
    if (linkValue) {
        link.value = linkValue
    }

    let guestKey = urlSearchParams.get("key")
    guestKey ||= localStorage.getItem("guest_key")
    if (guestKey) {
        guest_key.value = guestKey
    }

    let guestsValues = JSON.parse(localStorage.getItem("guests")) || []
    guestValues = guestsValues.join("\n")
    if (guestValues) {
        guests.value = guestvalues
    }

    const messageTemplate = localStorage.getItem("message_template")
    if (messageTemplate) {
        message_template.value = messageTemplate
    } 
}

function save() {
    localStorage.setItem("message_template", message_template.value)
    localStorage.setItem("link", link.value)
    localStorage.setItem("guest_key", guest_key.value)
    localStorage.setItem("guests", JSON.stringify(guests.value.split("\n")))
    localStorage.setItem("current_index", 0)
}

function saveAndAlert() {
    save()
    alert("Berhasil disimpan!")
}

function populateAndSend() {
    const messageTemplate = message_template.value
    let missingPlaceholders = []
    let isError = false
    if (!messageTemplate.includes("{{ nama_tamu }}")) {
        isError = true
        missingPlaceholders.push("{{ nama_tamu }}")
    }
    if (!messageTemplate.includes("{{ link_undangan }}")) {
        isError = true
        missingPlaceholders.push("{{ link_undangan }}")
    }
    if (guests.value.trim().length == 0) {
        isError = true
        guestListErrorMessage.innerText = "Nama tamu undangan harus diisi."
    }
    if (missingPlaceholders.length != 0) {
        errorMessage.innerText = `${missingPlaceholders.join(" dan ")} harus ada di dalam template pesan.`
    }
    if (isError) {
        window.location.href = "#"
        return      
    }  
    
    save()
    window.open("/kirim.html", "_self")
}

function populateMessage() {
    const currentIndex = parseInt(localStorage.getItem("current_index") || 0)
    const guests = JSON.parse(localStorage.getItem("guests")) || []
    const link = localStorage.getItem("link")
    const guestKey = localStorage.getItem("guest_key")
    const guest = guests[currentIndex]
    
    const fullLink = `${link}?${guestKey}=${guest.replace(" ", "+")}`
    
    let message = localStorage.getItem("message_template")
    return message.replace("{{ nama_tamu }}", guest).replace("{{ link_undangan }}", fullLink)
}

function sendToWhatsApp() {
    window.isSent = true
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(invitationMessage.innerText)}`)
}

function nextGuest() {
    let currentIndex = parseInt(localStorage.getItem("current_index") || 0)
    currentIndex += 1

    const guests = JSON.parse(localStorage.getItem("guests")) || []
    
    if (currentIndex >= guests.length) {
        window.open("/done.html", "_self")
    } else {
        localStorage.setItem("current_index", currentIndex)
        window.open("/kirim.html", "_self")
    }
}

function setStep() {
    const guests = (JSON.parse(localStorage.getItem("guests")) || [])
    const currentIndex = parseInt(localStorage.getItem("current_index") || 0)
    const guest = guests[currentIndex]

    step.innerText = `${currentIndex + 1} dari ${guests.length} nama tamu.`
    currentGuest.innerText = guest
}