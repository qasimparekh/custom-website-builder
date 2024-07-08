import Editor from './_components/editor'
import EditorNavigation from './_components/editor-navigation'
import EditorSidebar from './_components/editor-sidebar'

type Props = {}

const EditorPage = (props: Props) => {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden'>
      <EditorNavigation />

      <div className='h-full flex justify-center'>
        <Editor liveMode={false} />
      </div>

      <EditorSidebar />
    </div>
  )
}

export default EditorPage