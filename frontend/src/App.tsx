import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface GroceryItem {
  id: bigint;
  name: string;
  emoji: string;
  completed: boolean;
}

interface Category {
  name: string;
  items: Array<{ id: bigint; name: string; emoji: string }>;
}

const App: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroceryItems();
    fetchCategories();
  }, []);

  const fetchGroceryItems = async () => {
    try {
      const items = await backend.getItems();
      setGroceryItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grocery items:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await backend.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleItemCompletion = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.toggleItemCompletion(id);
      fetchGroceryItems();
    } catch (error) {
      console.error('Error toggling item completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.removeItem(id);
      fetchGroceryItems();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" component="h1" gutterBottom>
        Grocery List App
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
              Categories
            </Typography>
            <List>
              {categories.map((category) => (
                <ListItem key={category.name}>
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
              Grocery List
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <List>
                {groceryItems.map((item) => (
                  <ListItem key={item.id.toString()}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={item.completed}
                        onChange={() => toggleItemCompletion(item.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${item.emoji} ${item.name}`}
                      style={{ textDecoration: item.completed ? 'line-through' : 'none' }}
                    />
                    <IconButton edge="end" onClick={() => removeItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
