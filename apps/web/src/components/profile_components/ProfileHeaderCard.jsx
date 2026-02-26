'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit2 } from 'lucide-react'

export default function ProfileHeaderCard({ profile, session, onEditProfile }) {
  return (
    <Card className="mb-8 border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar ? <img
              src={profile?.avatar || '/placeholder.svg'}
              alt={`${profile?.firstName[0] || session.user.name[0]} ${profile?.lastName[0] || ''}`}
              className="h-16 w-16 rounded-full border-2 border-primary bg-background"
            />: <p className='h-16 w-16 rounded-full border-2 font-bold text-xl
             border-primary bg-background uppercase flex items-center justify-center'>
              {profile?.firstName[0] || session.user.name[0]} {profile?.lastName[0] || ''}</p>}
            
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.firstName || session.user.name} {profile?.lastName}
              </h2>
              <p className="text-muted-foreground">{profile?.email || session.user.email}</p>
            </div>
          </div>
          <Button onClick={onEditProfile} className="gap-2 bg-primary hover:bg-primary/90">
            <Edit2 size={18} />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
