import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, IconButton, CircularProgress, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
  const [cartItems, setCartItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
    fetchCategories();
  }, []);

  const fetchCartItems = async () => {
    try {
      const items = await backend.getCartItems();
      setCartItems(items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart items:', error);
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

  const addToCart = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.addToCart(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemCompletion = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.toggleItemCompletion(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error toggling item completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: bigint) => {
    setLoading(true);
    try {
      await backend.removeFromCart(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
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
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
              Categories
            </Typography>
            {categories.map((category) => (
              <div key={category.name}>
                <Typography variant="h6">{category.name}</Typography>
                <List>
                  {category.items.map((item) => (
                    <ListItem key={item.id.toString()}>
                      <ListItemText primary={`${item.emoji} ${item.name}`} />
                      <IconButton edge="end" onClick={() => addToCart(item.id)}>
                        <AddShoppingCartIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
              Shopping Cart
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <List>
                {cartItems.map((item) => (
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
                    <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
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
