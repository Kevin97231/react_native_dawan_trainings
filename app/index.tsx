import { TrainingSkeleton } from "@/components/TrainingSkeleton";
import { useTrainingApi } from "@/hooks/useTrainingApi";
import { Training } from "@/interfaces/Training";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Button,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { truncateText } from "@/helpers/textJsFunctions"; // Import the helper function
const ITEMS_PER_PAGE = 10;

export default function AllTrainings() {
  const { get, loading } = useTrainingApi();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await get();
      setTrainings(response);
    };

    fetchData();
  }, []);

  // Calculate the index range of items to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTrainings = trainings.slice(startIndex, endIndex);
  const totalPages = Math.ceil(trainings.length / ITEMS_PER_PAGE);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => {
        const newPage = prevPage - 1;
        scrollToTop();
        return newPage;
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => {
        const newPage = prevPage + 1;
        scrollToTop();
        return newPage;
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      key={`page-${currentPage}`} // Key to force re-render
    >
      {loading
        ? Array(ITEMS_PER_PAGE)
            .fill({})
            .map((_, index) => <TrainingSkeleton key={index} />)
        : paginatedTrainings.map((item) => (
            <View key={item.slug} style={styles.itemContainer}>
              <Text style={styles.title}>{item.title}</Text>
              {item.objectives!! && (
                <RenderHTML
                  contentWidth={width}
                  source={{ html: truncateText(item.objectives) }}
                />
              )}
            </View>
          ))}
      {/* Pagination Controls */}
      <View style={styles.paginationControls}>
        <Button
          title="Précédent"
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Suivant"
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#3a4065",
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "white",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#e51f27",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  pageInfo: {
    fontSize: 16,
    color: "#ffffff",
  },
});
