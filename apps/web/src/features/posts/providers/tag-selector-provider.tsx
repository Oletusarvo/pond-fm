import { useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { useGenreSelector } from "../hooks/use-genre-selector";
import { TagSelectorModal } from "../components/tag-selector-modal";

const [TagSelectorProvider, useTagSelectorContext] = createProvider({
  contextName: 'TagSelectorContext',
  hook: () => {
    const genreSelector = useGenreSelector();
    const [showTagSelectorModal, setShowTagSelectorModal] = useState(false);
    return {
      ...genreSelector,
      showTagSelectorModal, toggleShowTagSelectorModal: (state: boolean) => setShowTagSelectorModal(state)
    }
  },
  childComponent: ({ showTagSelectorModal }) => {
    return showTagSelectorModal ? <TagSelectorModal /> : null
  }
});

export { TagSelectorProvider, useTagSelectorContext }