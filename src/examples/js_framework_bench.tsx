import { h, For, createSignal, createSelector } from "../rwr";

import "./bootstrap.css";
import "./js_bench.css";

const BATCH_SIZE = 1000;

let idCounter = 1;
const adjectives = [
        "pretty",
        "large",
        "big",
        "small",
        "tall",
        "short",
        "long",
        "handsome",
        "plain",
        "quaint",
        "clean",
        "elegant",
        "easy",
        "angry",
        "crazy",
        "helpful",
        "mushy",
        "odd",
        "unsightly",
        "adorable",
        "important",
        "inexpensive",
        "cheap",
        "expensive",
        "fancy",
    ],
    colours = [
        "red",
        "yellow",
        "blue",
        "green",
        "pink",
        "brown",
        "purple",
        "brown",
        "white",
        "black",
        "orange",
    ],
    nouns = [
        "table",
        "chair",
        "house",
        "bbq",
        "desk",
        "car",
        "pony",
        "cookie",
        "sandwich",
        "burger",
        "pizza",
        "mouse",
        "keyboard",
    ];

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
    let data = new Array(count);
    for (let i = 0; i < count; i++) {
        const [label, setLabel] = createSignal(
            `${adjectives[_random(adjectives.length)]} ${
                colours[_random(colours.length)]
            } ${nouns[_random(nouns.length)]}`
        );
        data[i] = {
            id: idCounter++,
            label,
            setLabel,
        };
    }
    return data;
}

const Button =
    ({ id, text, fn }) =>
    () =>
        (
            <div class="col-sm-6 smallpad">
                <button
                    id={id}
                    class="btn btn-primary btn-block"
                    type="button"
                    onclick={fn}
                >
                    {text}
                </button>
            </div>
        );

export const App = () => {
    const [data, setData] = createSignal<any[]>([]),
        [selected, setSelected] = createSignal(null),
        run = () => setData(buildData(BATCH_SIZE)),
        runLots = () => setData(buildData(10 * BATCH_SIZE)),
        add = () => setData((d) => [...d!, ...buildData(BATCH_SIZE)]),
        update = () => {
            for (let i = 0, d = data(), len = d.length; i < len; i += 10)
                d[i].setLabel((l) => l + " !!!");
        },
        swapRows = () => {
            const d = data().slice();
            if (d.length >= 5) {
                let tmp = d[1];
                d[1] = d[d.length - 2];
                d[d.length - 2] = tmp;
                setData(d);
            }
        },
        clear = () => setData([]),
        remove = (id) =>
            setData((d) => {
                const idx = d!.findIndex((d) => d.id === id);
                return [...d!.slice(0, idx), ...d!.slice(idx + 1)];
            }),
        isSelected = createSelector(selected);

    return () => (
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>SolidJS Keyed</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <Button
                                id="run"
                                text="Create 1,000 rows"
                                fn={run}
                            />
                            <Button
                                id="runlots"
                                text="Create 10,000 rows"
                                fn={runLots}
                            />
                            <Button
                                id="add"
                                text="Append 1,000 rows"
                                fn={add}
                            />
                            <Button
                                id="update"
                                text="Update every 10th row"
                                fn={update}
                            />
                            <Button id="clear" text="Clear" fn={clear} />
                            <Button
                                id="swaprows"
                                text="Swap Rows"
                                fn={swapRows}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    <For each={data}>
                        {(row) => {
                            let rowId = row.id;
                            return (
                                <tr class={isSelected(rowId) ? "danger" : ""}>
                                    <td class="col-md-1">{rowId}</td>
                                    <td class="col-md-4">
                                        <a onclick={() => setSelected(rowId)}>
                                            {row.label}
                                        </a>
                                    </td>
                                    <td class="col-md-1">
                                        <a onclick={() => remove(rowId)}>
                                            <span
                                                class="glyphicon glyphicon-remove"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </td>
                                    <td class="col-md-6" />
                                </tr>
                            );
                        }}
                    </For>
                </tbody>
            </table>
            <span
                class="preloadicon glyphicon glyphicon-remove"
                aria-hidden="true"
            />
        </div>
    );
};
