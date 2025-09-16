import React from "react";
import GoalsList from "./GoalsList";
import Projections from "./Projections";
import GoalModal from "./GoalModal";
import { useSavingsTracker } from "./useSavingsTracker";
import AuthPopup from "../../auth/AuthPopup";

export default function SavingsTracker() {
  const tracker = useSavingsTracker();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GoalsList
        savingsData={tracker.savingsData}
        results={tracker.results}
        onEdit={tracker.openEditModal}
        onDelete={tracker.handleDelete}
        onContribute={tracker.handleContribute}
        isDeleting={tracker.isDeleting}
      />

      <Projections
        savingsData={tracker.savingsData}
        results={tracker.results}
        onAdd={() => tracker.openAddModal()}
      />

      <GoalModal
        open={tracker.showModal}
        editingGoal={tracker.editingGoal}
        contributionAmount={tracker.contributionAmount}
        setContributionAmount={tracker.setContributionAmount}
        onClose={() => tracker.setShowModal(false)}
        onSave={tracker.handleAddOrUpdate}
      />

      <AuthPopup
        visible={tracker.showAuthPopup}
        onLogin={() => {}}
        onSignup={() => {}}
        onClose={() => tracker.setShowAuthPopup(false)}
      />
    </div>
  );
}
