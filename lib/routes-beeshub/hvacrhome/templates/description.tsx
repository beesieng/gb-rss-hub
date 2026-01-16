import { raw } from 'hono/html';
import { renderToString } from 'hono/jsx/dom/server';

type DescriptionImage = {
    src?: string;
    alt?: string;
};

type DescriptionRenderOptions = {
    image?: DescriptionImage;
    description?: string;
};

export const renderDescription = ({ image, description }: DescriptionRenderOptions): string =>
    renderToString(
        <>
            {image?.src ? (
                    <figure>
                        <img src={image.src} alt={image.alt ?? undefined} referrerpolicy="no-referrer" />
                    </figure>
                ) : null}
            {description ? <>{raw(description)}</> : null}
        </>
    );
