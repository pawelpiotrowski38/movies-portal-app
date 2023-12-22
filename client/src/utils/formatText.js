export function capitalizeFirstLetter(text) {
    return (
        text
        .split(', ')
        .map((element) => (
            element
            .split(/[\s-]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join((element.includes('-')) ? '-' : ' ')
        ))
    );
}

export function convertToUrlFormat(text) {
    return (
        text
        .toLowerCase()
        .replace(/\s+/g, '-')
    );
}