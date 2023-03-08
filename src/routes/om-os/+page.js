export const load = (async ({ fetch }) => {
    const response = await fetch('https://api.db-ip.com/v2/free/self', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': 'https://toldjs.com'
        }
    });
    const data = await response.json();
    return data;
});