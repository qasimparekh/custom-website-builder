"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { RootState } from "@/redux/store"
import { clsx } from "clsx"
import { useDispatch, useSelector } from "react-redux"
import TabsList from "./tabs"
import SettingsTab from "./tabs/settings-tab"
import ComponentsTab from "./tabs/_components"

type Props = {}

const EditorSidebar = (props: Props) => {
  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.builder)

  return (
    <Sheet
      open={true}
      modal={false}
    >
      <Tabs
        className="w-full "
        defaultValue="Settings"
      >
        <SheetContent
          // showX={false}
          side="right"
          allowClose={false}
          className={clsx(
            'mt-[97px] w-16 z-[80] shadow-none  p-0 focus:border-none transition-all overflow-hidden',
            { hidden: state.editor.previewMode }
          )}
        >
          <TabsList />
        </SheetContent>
        <SheetContent
          // showX={false}
          side="right"
          allowClose={false}
          className={clsx(
            'mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 bg-background h-full transition-all overflow-hidden',
            { hidden: state.editor.previewMode }
          )}
        >
          <div className="grid gap-4 h-full pb-36 overflow-scroll no-scrollbar">
            <TabsContent value="Settings">
              <SheetHeader className="text-left p-6">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you
                  like.
                </SheetDescription>
              </SheetHeader>
              <SettingsTab />
            </TabsContent>
            <TabsContent value="Media">
              {/* <MediaBucketTab subaccountId={subaccountId} /> */}
            </TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="text-left p-6 ">
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>
                  You can drag and drop components on the canvas
                </SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  )
}

export default EditorSidebar