import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Checkbox, IconButton, CircularProgress, Box, Fade } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { styled } from '@mui/material/styles';

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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#FFFFFF',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});

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
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.addToCart(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const toggleItemCompletion = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.toggleItemCompletion(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error toggling item completion:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  const removeFromCart = async (id: bigint) => {
    setLoadingItems(prev => ({ ...prev, [id.toString()]: true }));
    try {
      await backend.removeFromCart(id);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [id.toString()]: false }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 4 }}>
        Grocery List
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={0}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb: 3 }}>
              Categories
            </Typography>
            <Box sx={{ overflowY: 'auto', flexGrow: 1, pr: 2 }}>
              {categories.map((category) => (
                <Box key={category.name} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>{category.name}</Typography>
                  <List>
                    {category.items.map((item) => (
                      <StyledListItem key={item.id.toString()}>
                        <ListItemText primary={`${item.emoji} ${item.name}`} />
                        <IconButton
                          edge="end"
                          onClick={() => addToCart(item.id)}
                          color="primary"
                          disabled={loadingItems[item.id.toString()]}
                        >
                          {loadingItems[item.id.toString()] ? (
                            <CircularProgress size={24} />
                          ) : (
                            <AddShoppingCartIcon />
                          )}
                        </IconButton>
                      </StyledListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={0}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb: 3 }}>
              Shopping Cart
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
                {cartItems.map((item) => (
                  <Fade in={!loadingItems[item.id.toString()]} key={item.id.toString()}>
                    <StyledListItem>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={item.completed}
                          onChange={() => toggleItemCompletion(item.id)}
                          color="secondary"
                          disabled={loadingItems[item.id.toString()]}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.emoji} ${item.name}`}
                        sx={{ textDecoration: item.completed ? 'line-through' : 'none' }}
                      />
                      <IconButton
                        edge="end"
                        onClick={() => removeFromCart(item.id)}
                        color="error"
                        disabled={loadingItems[item.id.toString()]}
                      >
                        {loadingItems[item.id.toString()] ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </StyledListItem>
                  </Fade>
                ))}
              </List>
            )}
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
