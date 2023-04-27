import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Rating } from '@mui/material';
//@ts-ignore
export default function MediaCard({ post }) {

    const getRatingAvg = () => {
        let sum = 0;//@ts-ignore
        post.reviews.forEach(r => {
            sum += r.rating
        })
        return Number.parseFloat((sum / post.reviews.length).toFixed(2))
    }
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={`https://ik.imagekit.io/epvjvvihm/${post.images[0].name}`}
                title="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h3" component="div">
                    {post.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    {post.categories.join(", ")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.description}
                </Typography>

                <Typography component="legend">Ratings {post.reviews.length}</Typography>
                <Rating name="read-only" value={getRatingAvg()} readOnly />
            </CardContent>
            <CardActions>

                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}