const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value) => currency.format(Number(value));

export const formatDate = (value) => new Date(value).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});
