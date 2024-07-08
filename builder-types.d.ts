type EditorBtns = 
    | "text"
    | "container"
    | "section"
    | "contactForm"
    | "paymentForm"
    | "link"
    | "2Col"
    | "video"
    | "__body"
    | "image"
    | null
    | "3col"


type DeviceTypes = "Mobile" | "Tablet" | "Desktop"

type EditorElement = {
    id: string
    styles: React.CSSProperties
    name: string
    type: EditorBtns
    content: EditorElement[] | { href?: string, alt?: string, src?: string, innerText?: string }
}

type Editor = {
    elements: EditorElement[]
    liveMode: boolean
    selectedElement: EditorElement
    device: DeviceTypes
    previewMode: boolean
    pageId?: string
}

type HistoryState = {
    history: Editor[]
    currentIndex: number
}

type EditorState = {
    editor: Editor
    history: HistoryState
}