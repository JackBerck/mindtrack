<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('type')->default('course'); // 'course', 'activity', 'achievement'
            $table->json('criteria')->nullable(); // JSON to store criteria for earning the badge
            $table->boolean('is_active')->default(true); // To enable/disable badges without deleting them
            $table->integer('sort_order')->default(0); // For ordering badges in UI
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
