'use client'

import React, { useState, useMemo } from 'react'
import { Search, Shield, Ban, Trash2, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const MOCK_USERS = [
  { id: 'U001', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', status: 'active', joinDate: '2026-01-15' },
  { id: 'U002', name: 'Bob Smith', email: 'bob@example.com', role: 'seller', status: 'active', joinDate: '2026-01-20' },
  { id: 'U003', name: 'Carol Davis', email: 'carol@example.com', role: 'user', status: 'suspended', joinDate: '2025-12-10' },
  { id: 'U004', name: 'David Lee', email: 'david@example.com', role: 'user', status: 'active', joinDate: '2026-02-01' },
  { id: 'U005', name: 'Eve Wilson', email: 'eve@example.com', role: 'seller', status: 'active', joinDate: '2026-01-28' },
  { id: 'U006', name: 'Frank Miller', email: 'frank@example.com', role: 'user', status: 'active', joinDate: '2026-02-05' },
  { id: 'U007', name: 'Grace Lee', email: 'grace@example.com', role: 'user', status: 'suspended', joinDate: '2025-11-15' },
  { id: 'U008', name: 'Henry Brown', email: 'henry@example.com', role: 'seller', status: 'active', joinDate: '2026-02-10' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      seller: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  const handlePromoteToSeller = (userId) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: 'seller' } : u)))
  }

  const handleDemoteToUser = (userId) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: 'user' } : u)))
  }

  const handleSuspendUser = (userId) => {
    setUsers(users.map((u) =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ))
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage all platform users, roles, and statuses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-8">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground text-green-600">
                {users.filter((u) => u.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Sellers</p>
              <p className="text-2xl font-bold text-foreground text-blue-600">
                {users.filter((u) => u.role === 'seller').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Suspended</p>
              <p className="text-2xl font-bold text-foreground text-red-600">
                {users.filter((u) => u.status === 'suspended').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="border-border bg-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'user', 'seller'].map((role) => (
                  <Button
                    key={role}
                    variant={roleFilter === role ? 'default' : 'outline'}
                    className={roleFilter === role ? 'bg-primary' : 'border-primary text-primary'}
                    onClick={() => setRoleFilter(role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Users</CardTitle>
            <CardDescription>{filteredUsers.length} users found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Email</TableHead>
                    <TableHead className="text-foreground">Role</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Joined</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.joinDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.role === 'user' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary/10"
                              onClick={() => handlePromoteToSeller(user.id)}
                              title="Promote to Seller"
                            >
                              <Crown className="h-4 w-4" />
                            </Button>
                          ) : user.role === 'seller' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-accent text-accent hover:bg-accent/10"
                              onClick={() => handleDemoteToUser(user.id)}
                              title="Demote to User"
                            >
                              <Crown className="h-4 w-4" />
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
