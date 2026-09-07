import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CurriculumRow } from './CurriculumRow';
import { CurriculumDrawer } from './CurriculumDrawer';
import { BRAND } from '../lib/brand';
import {
  fetchCurriculum,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  type CurriculumItem,
  type CurriculumFormData,
} from '../lib/curriculum';

type DrawerState = { open: false } | { open: true; item: CurriculumItem | null };

export function CurriculumTab() {
  const [items, setItems] = useState<CurriculumItem[]>([]);
  const [drawer, setDrawer] = useState<DrawerState>({ open: false });

  const loadCurriculum = useCallback(() => {
    fetchCurriculum()
      .then(setItems)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadCurriculum();
  }, [loadCurriculum]);

  const editingItem = drawer.open ? drawer.item : null;

  const handleSave = async (data: CurriculumFormData) => {
    if (editingItem) {
      await updateCurriculum(editingItem.id, data);
    } else {
      await createCurriculum(data);
    }
    loadCurriculum();
  };

  const handleDelete = async () => {
    if (!editingItem) return;
    await deleteCurriculum(editingItem.id);
    setDrawer({ open: false });
    loadCurriculum();
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        px: 2,
        py: 2,
        pb: { xs: '88px', md: 3 },
        overflowY: 'auto',
      }}
    >
      {items.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
          No curriculum yet.
        </Typography>
      ) : (
        items.map((item) => (
          <CurriculumRow key={item.id} item={item} onOpen={() => setDrawer({ open: true, item })} />
        ))
      )}

      <Fab
        onClick={() => setDrawer({ open: true, item: null })}
        aria-label="Add curriculum"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 20, md: 32 },
          bgcolor: BRAND.navy,
          color: '#fff',
          boxShadow: 3,
          '&:hover': { bgcolor: '#112C56' },
        }}
      >
        <AddIcon />
      </Fab>

      <CurriculumDrawer
        open={drawer.open}
        editItem={editingItem}
        onClose={() => setDrawer({ open: false })}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </Box>
  );
}
