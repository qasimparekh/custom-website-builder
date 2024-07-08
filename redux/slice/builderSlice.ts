"use client"

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialEditorState: Editor = {
    elements: [
        {
            content: [],
            id: '__body',
            name: 'Body',
            styles: {},
            type: '__body'
        },
    ],
    selectedElement: {
        id: '',
        content: [],
        name: '',
        styles: {},
        type: null,
    },
    device: 'Desktop',
    previewMode: false,
    liveMode: false,
    pageId: '',
}

const initialHistoryState: HistoryState = {
    history: [initialEditorState],
    currentIndex: 0,
}

const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
}


const addAnElement = (editorArray: EditorElement[], action: any): EditorElement[] => {
    return editorArray.map((item) => {
        // if we are at the container where we want to put the element and container has elements, we put the element in the container along with other elements
        if(item.id === action.payload.containerId && Array.isArray(item.content)) {
            return {
                ...item,
                content: [...item.content, action.payload.elementDetails]
            }
            //if the current container has other containers, we recursively call the function to find the container where we want to put the element
        } else if(item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: addAnElement(item.content, action)
            }
        }
        return item
    })
}

const updateAnElement = (editorArray: EditorElement[], action: any): EditorElement[] => {
    return editorArray.map((item) => {
        if(item.id === action.payload.elementDetails.id) { //if we reach at the required element, update it
            return { ...item, ...action.payload.elementDetails }
        } else if(item.content && Array.isArray(item.content)) { //else if the current item is a container and has child elements, recursively call the function to find the element in them
            return {
                ...item,
                content: updateAnElement(item.content, action)
            }
        }
        return item //else return that element as it is
    })
}

const deleteAnElement = (editorArray: EditorElement[], action: any): EditorElement[] => {
    return editorArray.filter((item) => {
        if(item.id === action.payload.elementDetails.id) {
            return false
        } else if(item.content && Array.isArray(item.content)) {
            item.content = deleteAnElement(item.content, action)
        }
        return true
    })

}

export const builderSlice = createSlice({
    name: "builder",
    initialState,
    reducers: {
        addElement: (state, action) => {
            const updatedEditorState = {
                ...state.editor,
                elements: addAnElement(state.editor.elements, action)
            }

            //update history to add include entire Updated Editor State
            const updatedHistory = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorState }
            ]

            state.editor = updatedEditorState
            state.history.history = updatedHistory
            state.history.currentIndex = updatedHistory.length - 1
        },

        updateElement: (state, action) => {
            const updatedElements = updateAnElement(state.editor.elements, action)

            const isUpdatedElementSelected = state.editor.selectedElement.id === action.payload.elementDetails.id

            const updatedEditorState = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: isUpdatedElementSelected ? action.payload.elementDetails : {
                    id: '',
                    content: [],
                    name: '',
                    styles: {},
                    type: null,
                }
            }

            const updatedHistory = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorState }
            ]

            state.editor = updatedEditorState
            state.history.history = updatedHistory
            state.history.currentIndex = updatedHistory.length - 1
        },

        deleteElement: (state, action) => {
            const updatedElementsAfterDelete = deleteAnElement(state.editor.elements, action)

            const updatedEditorState = {
                ...state.editor,
                elements: updatedElementsAfterDelete,
            }

            const updatedHistory = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorState }
            ]

            state.editor = updatedEditorState
            state.history.history = updatedHistory
            state.history.currentIndex += 1
        },

        changeClickedElement(state, action) {
            state.editor.selectedElement = action.payload.elementDetails || {
                id: '',
                content: [],
                name: '',
                styles: {},
                type: null,
            }
            //* uncomment if want to save clickedElement updates also
            // state.history.history = [ 
            //     ...state.history.history.slice(0, state.history.currentIndex + 1),
            //     { ...state.editor }
            // ]
            // state.history.currentIndex += 1
        },

        changeDevice(state, action) {
            state.editor.device = action.payload.device
        },

        togglePreviewMode(state) {
            state.editor.previewMode = !state.editor.previewMode
        },

        toggleLiveMode(state, action: PayloadAction<{ value?: boolean }>) {
            state.editor.liveMode = action.payload?.value ? action.payload.value : !state.editor.liveMode
        },

        redo(state) {
            if(state.history.currentIndex < state.history.history.length-1) {
                const nextIndex = state.history.currentIndex + 1   
                const nextEditorState = { ...state.history.history[nextIndex] }
                
                state.editor = nextEditorState
                state.history.currentIndex = nextIndex
            }
        },

        undo(state) {
            if(state.history.currentIndex > 0) {
                const prevIndex = state.history.currentIndex - 1
                const prevEditorState = { ...state.history.history[prevIndex] }

                state.editor = prevEditorState
                state.history.currentIndex = prevIndex
            }
        },

        loadData (state, action) {
            state.editor.elements = action.payload.elements || initialEditorState.elements
            state.editor.liveMode = !!action.payload.withLive
        }
    }
})

export const { addElement, updateElement, deleteElement, changeClickedElement, changeDevice, togglePreviewMode, toggleLiveMode, redo, undo, loadData } = builderSlice.actions

export default builderSlice.reducer