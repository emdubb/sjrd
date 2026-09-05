import { useState, useEffect } from 'react';
import { Drawer } from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { AdminUserViewBody } from './AdminUserViewBody';
import { AdminUserViewActions } from './AdminUserViewActions';
import { AdminUserAssignmentForm } from './AdminUserAssignmentForm';
import { fetchTeams } from '../lib/events';
import {
  updateUserAssignments,
  invitePendingUser,
  inviteAccountUser,
  type AdminUser,
} from '../lib/adminUsers';
import type { UserType } from '../lib/userTypes';

type Mode = 'view' | 'edit';

interface Props {
  user: AdminUser | null;
  onClose: () => void;
  onChanged: () => void;
}

export function AdminUserDetailDrawer({ user, onClose, onChanged }: Props) {
  const [mode, setMode] = useState<Mode>('view');
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch(() => {});
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user) return;
    setMode('view');
    setUserTypes(user.userTypes);
    setTeamIds(user.teamIds);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!user) return null;

  const toggleUserType = (type: UserType) =>
    setUserTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const toggleTeam = (teamId: string) =>
    setTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((t) => t !== teamId) : [...prev, teamId]
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserAssignments(user, { userTypes, teamIds });
      onChanged();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    setInviting(true);
    try {
      if (user.source === 'pending') {
        await invitePendingUser(user.id);
      } else {
        await inviteAccountUser(user.id);
      }
      onChanged();
    } finally {
      setInviting(false);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader
        title={mode === 'edit' ? 'Edit Assignments' : undefined}
        onClose={onClose}
      />

      {mode === 'view' ? (
        <>
          <AdminUserViewBody user={user} />
          <AdminUserViewActions
            invited={user.invited}
            inviting={inviting}
            onInvite={handleInvite}
            onEdit={() => setMode('edit')}
          />
        </>
      ) : (
        <AdminUserAssignmentForm
          name={user.name}
          email={user.email}
          userTypes={userTypes}
          onToggleUserType={toggleUserType}
          teams={teams}
          teamIds={teamIds}
          onToggleTeam={toggleTeam}
          saving={saving}
          onSave={handleSave}
        />
      )}
    </Drawer>
  );
}
