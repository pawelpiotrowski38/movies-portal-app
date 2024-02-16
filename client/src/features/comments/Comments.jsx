import { useEffect, useState } from "react";
import { commentsSortValues, commentsSortTexts } from '../../data/constants';
import api from "../../api/api";
import SelectInput from "../../ui/SelectInput";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import Message from "../../ui/Message";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import './comments.scss';

export default function Comments({ movieId }) {
    const [comments, setComments] = useState([]);
    const [allCommentsCount, setAllCommentsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState('new');

    useEffect(() => {
        const fetchData = async function() {
            const queryParams = {
                sortOption: sortOption,
                offset: 0,
                limit: 10,
            }
            try {
                setIsLoading(true);
                const response = await api.get(`/movies/${movieId}/comments`, { params: queryParams });
                setComments(response.data.results);
                setAllCommentsCount(response.data.count);
            } catch (err) {
                console.log(err.response.data.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [movieId, sortOption]);

    const handleShowMore = async function() {
        const queryParams = {
            sortOption: sortOption,
            offset: comments.length,
            limit: 10,
        }
        try {
            setIsLoading(true);
            const response = await api.get(`/movies/${movieId}/comments`, { params: queryParams });
            setComments((prevComments) => [...prevComments, ...response.data.results]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSortOptionChange = function(e) {
        setSortOption(e.target.value);
    };

    return (
        <section className='comments'>
            <CommentForm
                movieId={movieId}
                onSetComments={setComments}
                numberOfComments={allCommentsCount}
                onSetAllCommentsCount={setAllCommentsCount}
            />
            <div className='comments__sort'>
                <SelectInput
                    width={'14rem'}
                    currentValue={sortOption}
                    valuesList={commentsSortValues}
                    textsList={commentsSortTexts}
                    onHandleSortOptionChange={handleSortOptionChange}
                />
            </div>
            {comments.length > 0 ? (
                <CommentsList comments={comments} />
            ) : (
                (!isLoading && (
                    <Message>
                        There are no comments
                    </Message>
                ))
            )}
            {(isLoading || comments.length < allCommentsCount) && (
                <div className='comments__message'>
                    {isLoading ? (
                        <Message>
                            <Spinner
                                primaryColor={'praimry-text-color'}
                                secondaryColor={'component-background-color'}
                            />
                        </Message>
                    ) : (
                        (comments.length < allCommentsCount && (
                            <Button
                                width={'100%'}
                                fontSize={'0.9375rem'}
                                onClick={handleShowMore}
                            >
                                Show more
                            </Button>
                        ))
                    )}
                </div>
            )}
        </section>
    )
}