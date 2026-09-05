import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Chip, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AdminPageShell } from '../../src/components/AdminPageShell';
import { AdminUserRow } from '../../src/components/AdminUserRow';
import { AdminUserDetailDrawer } from '../../src/components/AdminUserDetailDrawer';
import { AddUserDialog } from '../../src/components/AddUserDialog';
import { BRAND, pillChipSx } from '../../src/lib/brand';
import { fetchAdminUsers, filterAdminUsers, type AdminUser } from '../../src/lib/adminUsers';
import { USER_TYPE_ORDER, USER_TYPE_LABELS, type UserType } from '../../src/lib/userTypes';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserType | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const loadUsers = useCallback(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const visibleUsers = filterAdminUsers(users, search, typeFilter);
  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

  return (
    <AdminPageShell tab="users">
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}
      >
        <Typography variant="h5" sx={{ color: BRAND.navy, fontWeight: 700 }}>
          Users
        </Typography>
        <Button
          onClick={() => setAddOpen(true)}
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            fontWeight: 700,
            minHeight: 44,
            '&:hover': { bgcolor: '#112C56' },
          }}
        >
          Add User
        </Button>
      </Box>

      <TextField
        label="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        fullWidth
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All Types"
          onClick={() => setTypeFilter(null)}
          sx={pillChipSx(typeFilter === null)}
        />
        {USER_TYPE_ORDER.map((type) => (
          <Chip
            key={type}
            label={USER_TYPE_LABELS[type]}
            onClick={() => setTypeFilter(type)}
            sx={pillChipSx(typeFilter === type)}
          />
        ))}
      </Box>

      {visibleUsers.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
          {users.length === 0 ? 'No users found.' : 'No users match your search.'}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {visibleUsers.map((user) => (
            <AdminUserRow key={user.id} user={user} onOpen={() => setSelectedUserId(user.id)} />
          ))}
        </Box>
      )}

      <AdminUserDetailDrawer
        user={selectedUser}
        onClose={() => setSelectedUserId(null)}
        onChanged={loadUsers}
      />

      <AddUserDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => {
          setAddOpen(false);
          loadUsers();
        }}
      />
    </AdminPageShell>
  );
}
