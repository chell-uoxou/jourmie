import { Search } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'

const GroupSearch = () => {
  return (
    (
      <div className="flex items-end">
        <Button>
          <Search />
        </Button>
      </div>
    )
  )
}

export { GroupSearch };