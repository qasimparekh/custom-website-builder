
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { changeDevice, redo, toggleLiveMode, togglePreviewMode, undo } from "@/redux/slice/builderSlice"
import { RootState } from "@/redux/store"
import clsx from "clsx"
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FocusEventHandler, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

type Props = {}

const EditorNavigation = (props: Props) => {
  const [name, setName] = useState('Landing Page')

  const dispatch = useDispatch()
  const state = useSelector((state: RootState) => state.builder)
  const router = useRouter()

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
    event
  ) => {
    if (event.target.value === name) return
    if (event.target.value) {
      setName(event.target.value)

      toast('Success', {
        description: 'Saved Funnel Page title',
      })
      router.refresh()
    } else {
      toast('Oppse!', {
        description: 'You need to have a title!',
      })
    }
  }

  const handlePreviewClick = () => {
    dispatch(togglePreviewMode())
    // @ts-ignore
    dispatch(toggleLiveMode())
  }

  const handleUndo = () => {
    dispatch(undo())
  }

  const handleRedo = () => {
    dispatch(redo())
  }

  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements)
    try {
      // const response = await upsertFunnelPage(
      //   subaccountId,
      //   {
      //     ...funnelPageDetails,
      //     content,
      //   },
      //   funnelId
      // )
      // await saveActivityLogsNotification({
      //   agencyId: undefined,
      //   description: `Updated a funnel page | ${response?.name}`,
      //   subaccountId: subaccountId,
      // })
      console.log(content)
      toast('Success', {
        description: 'Saved Editor',
      })
    } catch (error) {
      toast('Oppse!', {
        description: 'Could not save editor',
      })
    }
  }

  return (
    <TooltipProvider>
      <nav className={clsx(
          'border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all',
          { '!h-0 !p-0 !overflow-hidden': state.editor.previewMode }
        )}>
          <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href="/">
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full ">
            <Input
              // defaultValue={funnelPageDetails.name}
              defaultValue={name}
              className="border-none h-5 m-0 p-0 text-lg"
              onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">
            {/* Path: /{funnelPageDetails.pathName} */}
              Path: /
            </span>
          </div>
        </aside>

        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value: string) => {
              dispatch(changeDevice({ device: value }))
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>

        <aside className="flex items-center gap-2">
          <Button
            variant={'ghost'}
            size={'icon'}
            className="group hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <EyeIcon className="group-hover:text-white transition-all ease-out" />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col item-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch
                // disabled
                defaultChecked={true}
              />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">
              {/* Last updated {funnelPageDetails.updatedAt.toLocaleDateString()} */}
              Last updated {new Date().toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  )
}

export default EditorNavigation